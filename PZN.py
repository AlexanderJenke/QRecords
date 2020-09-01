import json

import numpy as np

if __name__ == '__main__':
    pzns = []
    with open("/Users/alexanderjenke/Desktop/PZN.txt", 'r') as csv:
        csv.readline()
        csv.readline()
        for line in csv:
            pzn, _, _, name, *_ = line[:-1].split(';')
            pzns.append((pzn, name))

    print(len(pzns))
    np.random.shuffle(pzns)

    for i in range(0, len(pzns), 100):
        d = {}
        for j, (pzn, name) in enumerate(pzns[i:i + 100]):
            d[str(i + j)] = {'pzn': pzn, 'name': name}
        with open(f"PZN/{int(i / 100)}", 'w') as file:
            print(json.dumps(d), file=file)
