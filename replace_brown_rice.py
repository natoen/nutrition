import csv

input_file = 'nutrition.csv'
output_file = 'nutrition.csv.tmp'

total_row = [
    'Cooked Brown Rice (Koshihikari) Total',
    '1.52', '0.028', '0.01', '0.356', '0.014', '0.01', '0',
    '0.0016', '0.0002', '0.029', '0.0065', '0.0021', '0.025', '0.1', '0',
    '0', '0', '0.002', '0', '0.1', '0', '0.07', '0.001', '0.006', '0.49', '0.01',
    '1.3', '0.95', '0.01', '0.008',
    '0.0017', '0.0023', '0.0028', '0.0007', '0.0050', '0.0012', '0.0007', '0.0012',
    '0.0024', '0.0010', '0.0008', '0.0015', '0.0012', '0.0015', '0.0009', '0.0004',
    '0.0009', '0.0017',
    '0.0002', '0.00002', '0', '0.00001'
]

rdi_row = [
    'Cooked Brown Rice (Koshihikari) % Daily Value (RDI)',
    '0.076%', '0.056%', '0.0128%', '0.1294%', '0.05%', '0.0004%', '0%',
    '0.1333%', '0.0153%', '0.1812%', '0.13%', '0.1235%', '0.0833%', '0.025%', '0%',
    '0%', '0%', '0.0133%', '0%', '0.0181%', '0%', '0.0053%', '0.1111%', '0.0333%', '0.1166%', '0.4347%',
    '0.104%', '0.0202%', '0.0181%', '0.0727%',
    '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '',
    '', '', '', ''
]

with open(input_file, 'r', encoding='utf-8') as f:
    reader = list(csv.reader(f))

new_reader = []
for row in reader:
    if not row or not row[0]:
        new_reader.append(row)
        continue
    if row[0] == 'Brown Rice (Raw) Total':
        new_reader.append(total_row)
    elif row[0] == 'Brown Rice (Raw) % Daily Value (RDI)':
        new_reader.append(rdi_row)
    else:
        new_reader.append(row)

with open(output_file, 'w', encoding='utf-8', newline='') as f:
    writer = csv.writer(f)
    writer.writerows(new_reader)
