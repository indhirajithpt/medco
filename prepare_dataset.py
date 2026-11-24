import argparse, csv, hashlib, io, json, random, re, urllib.request, zipfile
from pathlib import Path
import xml.etree.ElementTree as ET
URL='https://github.com/abachaa/MedQuAD/archive/refs/heads/master.zip'
QUOTAS={'train':(360,40),'validation':(45,5),'test':(45,5)}
# Conservative subset selection; source rights still require manual review.
FOLDERS=('5_NIDDK_QA','6_NINDS_QA','8_NHLBI_QA_XML','9_CDC_QA')
def clean(s): return ' '.join(s.split())
def norm(s): return re.sub(r'[^a-z0-9]+',' ',s.lower()).strip()
def digest(s): return hashlib.sha256(s.encode()).hexdigest()
def read_public(raw):
    seen_q=set(); seen_a=set(); groups={}
    with zipfile.ZipFile(io.BytesIO(raw)) as z:
        for name in sorted(z.namelist()):
            if not name.endswith('.xml') or not any('/'+f+'/' in name for f in FOLDERS): continue
            root=ET.fromstring(z.read(name)); focus=clean(root.findtext('Focus') or '')
            url=root.get('url',''); group=norm(focus) or name
            for pair in root.findall('.//QAPair'):
                q=clean(''.join(pair.find('Question').itertext())) if pair.find('Question') is not None else ''
                a=clean(''.join(pair.find('Answer').itertext())) if pair.find('Answer') is not None else ''
                typ=pair.find('Question').get('qtype','').lower() if q else ''
                if typ not in {'information','symptoms','causes','prevention','susceptibility','outlook'}: continue
                if not (12<=len(q)<=500 and 60<=len(a)<=2200): continue
                if re.search(r'https?://|www\.|\b\d{3}[-.]\d{3}[-.]\d{4}\b',a): continue
                nq,na=norm(q),norm(a)
                if nq in seen_q or na in seen_a: continue
                seen_q.add(nq); seen_a.add(na)
                groups.setdefault(group,[]).append(dict(question=q,answer=a,source='MedQuAD',source_url=url,source_record=name+'#'+pair.get('pid',pair.get('id',digest(q)[:12])),group=group,category=typ,review_status='pending'))
    return groups

def build(raw,safety):
    rng=random.Random(42); groups=read_public(raw); keys=sorted(groups); rng.shuffle(keys)
    result={}; used=set()
    for split,(n,s) in QUOTAS.items():
        pool=[]
        for key in keys:
            if key in used: continue
            rows=groups[key][:]; rng.shuffle(rows); pool.extend(rows); used.add(key)
            if len(pool)>=n: break
        if len(pool)<n: raise ValueError(f'Insufficient public data for {split}: {len(pool)} of {n}')
        rng.shuffle(pool)
        custom=[r for r in safety if r['split']==split]
        assert len(custom)==s
        result[split]=pool[:n]+custom; rng.shuffle(result[split])
    return result

def record(r): return {'contents':[{'role':'user','parts':[{'text':r['question']}]},{'role':'model','parts':[{'text':r['answer']}]}]}
def main():
    p=argparse.ArgumentParser(); p.add_argument('--archive',type=Path,default=Path('MedQuAD.zip')); p.add_argument('--out',type=Path,default=Path('output')); args=p.parse_args()
    if not args.archive.exists():
        with urllib.request.urlopen(URL,timeout=120) as f: args.archive.write_bytes(f.read())
    raw=args.archive.read_bytes(); safety=json.loads(Path(__file__).with_name('safety_examples.json').read_text()); splits=build(raw,safety)
    args.out.mkdir(parents=True,exist_ok=True); provenance=[]; seen=set()
    for split,rows in splits.items():
        with (args.out/f'{split}.jsonl').open('w',encoding='utf-8') as f:
            for i,r in enumerate(rows,1):
                key=norm(r['question']); assert key not in seen; seen.add(key)
                f.write(json.dumps(record(r),ensure_ascii=False)+'\n'); provenance.append(dict(r,split=split,line=i,id=digest(key)[:16]))
    fields=['id','split','line','question','answer','source','source_url','source_record','group','category','review_status']
    with (args.out/'provenance.csv').open('w',encoding='utf-8',newline='') as f:
        w=csv.DictWriter(f,fieldnames=fields,extrasaction='ignore'); w.writeheader(); w.writerows(provenance)
    (args.out/'manifest.json').write_text(json.dumps({'archive_url':URL,'archive_sha256':hashlib.sha256(raw).hexdigest(),'seed':42,'counts':{k:len(v) for k,v in splits.items()},'status':'DRAFT — clinical and rights review required'},indent=2))
    print('Created 500 draft examples:',args.out)
if __name__=='__main__': main()
