import csv

input_file = 'nutrition.csv'
output_file = 'nutrition.csv.tmp'

total_row = [
    'Ground Sesame (擦り胡麻) Total',
    '5.99', '0.203', '0.542', '0.185', '0.126', '0.02', '0',
    '0.0049', '0.0023', '0.053', '0.0051', '0.0064', '0.15', '1.5', '0',
    '0', '0', '0.237', '0.12', '0.25', '0', '12.0', '0.0168', '0.099', '3.6', '0.0252',
    '5.6', '4.1', '0.01', '0.059',
    '0.011', '0.029', '0.019', '0.0044', '0.046', '0.012', '0.0063', '0.0088',
    '0.016', '0.0057', '0.0068', '0.011', '0.0085', '0.012', '0.0089', '0.0035',
    '0.0075', '0.011',
    '0.00001', '0.00005', '0', '0.00002'
]

rdi_row = [
    'Ground Sesame (擦り胡麻) % Daily Value (RDI)',
    '0.2995%', '0.406%', '0.6948%', '0.0672%', '0.45%', '0.0008%', '0%',
    '0.4083%', '0.1769%', '0.3312%', '0.102%', '0.3764%', '0.5%', '0.375%', '0%',
    '0%', '0%', '1.58%', '0.1%', '0.0454%', '0%', '0.923%', '1.8666%', '0.55%', '0.8571%', '1.0956%',
    '0.448%', '0.0872%', '0.0181%', '0.5363%',
    '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '',
    '', '', '', ''
]

empty_with_metals = [''] * 49 + ['0.02', '0.1', '0.002', '0.02']

with open(input_file, 'r', encoding='utf-8') as f:
    reader = list(csv.reader(f))

new_reader = []
for row in reader:
    if not row or not row[0]:
        new_reader.append(row)
        continue
    
    # Remove (Koshihikari) from row names
    if ' (Koshihikari)' in row[0]:
        row[0] = row[0].replace(' (Koshihikari)', '')
        
    new_reader.append(row)

# Append Sesame
new_reader.append(empty_with_metals)
new_reader.append(total_row)
new_reader.append(rdi_row)

with open(output_file, 'w', encoding='utf-8', newline='') as f:
    writer = csv.writer(f)
    writer.writerows(new_reader)
