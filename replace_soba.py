import csv

input_file = 'nutrition.csv'
output_file = 'nutrition.csv.tmp'

total_row = [
    'Boiled Soba (Noodles Only) Total',
    '1.32', '0.048', '0.007', '0.260', '0.015', '0.02', '0',
    '0.0003', '0.0002', '0.006', '0.001', '0.0002', '0.01', '0.11', '0',
    '0', '0', '0', '0', '0.1', '0', '0.07', '0.0007', '0.006', '0.23', '0.0036',
    '0.61', '0.34', '0.01', '0.004',
    '0.002', '0.003', '0.004', '0.001', '0.012', '0.002', '0.001', '0.002',
    '0.004', '0.002', '0.001', '0.002', '0.003', '0.002', '0.002', '0.0005',
    '0.001', '0.003',
    '0.00001', '0.00001', '0', '0.00001'
]

rdi_row = [
    'Boiled Soba (Noodles Only) % Daily Value (RDI)',
    '0.066%', '0.096%', '0.0089%', '0.0945%', '0.0535%', '0.0008%', '0%',
    '0.025%', '0.015%', '0.037%', '0.02%', '0.011%', '0.033%', '0.027%', '0%',
    '0%', '0%', '0%', '0%', '0.018%', '0%', '0.005%', '0.077%', '0.033%', '0.054%', '0.156%',
    '0.048%', '0.007%', '0.018%', '0.036%',
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
    
    if row[0] == 'Cafeteria Soba (With Broth) Total':
        new_reader.append(total_row)
    elif row[0] == 'Cafeteria Soba (With Broth) % Daily Value (RDI)':
        new_reader.append(rdi_row)
    else:
        new_reader.append(row)

with open(output_file, 'w', encoding='utf-8', newline='') as f:
    writer = csv.writer(f)
    writer.writerows(new_reader)
