import json

import numpy as np

if __name__ == '__main__':
    icds = []
    with open("/Users/alexanderjenke/Desktop/icd-10-gm.csv", 'r', encoding='utf-8') as csv:
        for line in csv:
            icd, name = line[:-1].split(';')
            icds.append((icd, name))

    np.random.shuffle(icds)

    for i in range(0, len(icds), 100):
        d = {}
        for j, (icd, name) in enumerate(icds[i:i + 100]):
            d[str(i + j).zfill(5)] = {'icd': icd, 'name': name, 'ref': ''}
        with open(f"app/ICD/{int(i / 100)}", 'w') as file:
            print(json.dumps(d), file=file)
