import csv

input_file = 'nutrition.csv'
output_file = 'nutrition.csv.tmp'

oil_total = [
    'Roasted Sesame Oil Total',
    '9.00', '0', '1.00', '0', '0', '0', '0',
    '0', '0', '0.001', '0', '0', '0', '0', '0',
    '0', '0', '0.451', '0.05', '0', '0', '0.01', '0.0001', '0.001', '0', '0',
    '0.01', '0', '0.01', '0',
    '0', '0', '0', '0', '0', '0', '0', '0',
    '0', '0', '0', '0', '0', '0', '0', '0',
    '0', '0',
    '0', '0', '0', '0.00001'
]

oil_rdi = [
    'Roasted Sesame Oil % Daily Value (RDI)',
    '0.45%', '0%', '1.282%', '0%', '0%', '0%', '0%',
    '0%', '0%', '0.0062%', '0%', '0%', '0%', '0%', '0%',
    '0%', '0%', '3.006%', '0.0416%', '0%', '0%', '0.0007%', '0.0111%', '0.0055%', '0%', '0%',
    '0.0008%', '0%', '0.0181%', '0%',
    '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '',
    '', '', '', ''
]

empty_with_metals = [''] * 49 + ['0.02', '0.1', '0.002', '0.02']

with open(input_file, 'r', encoding='utf-8') as f:
    reader = list(csv.reader(f))

reader.append(empty_with_metals)
reader.append(oil_total)
reader.append(oil_rdi)

with open(output_file, 'w', encoding='utf-8', newline='') as f:
    writer = csv.writer(f)
    writer.writerows(reader)
