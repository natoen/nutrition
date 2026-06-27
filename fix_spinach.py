import csv

input_file = 'nutrition.csv'
output_file = 'nutrition.csv.tmp'

with open(input_file, 'r', encoding='utf-8') as f:
    reader = list(csv.reader(f))

for i, row in enumerate(reader):
    if not row or not row[0]: continue
    if row[0] == 'Steamed Spinach Total':
        # Apply 1/1.4 to everything
        for j in range(1, len(row)):
            if not row[j]: continue
            val = float(row[j])
            
            # Undo existing complex multipliers and apply new 1:1 logic
            if j in [8, 9, 10, 11, 12]: # B1, B2, B3, B5, B6 (columns 8-12)
                row[j] = str(round(val / 1.19, 4))
            elif j == 14: # Folate
                row[j] = str(round((val / 1.12) * 0.8, 4))
            elif j == 16: # Vit C
                row[j] = str(round((val / 1.05) * 0.8, 4))
            else: # Everything else
                row[j] = str(round(val / 1.4, 4))
    
    elif row[0] == 'Steamed Spinach % Daily Value (RDI)':
        for j in range(1, len(row)):
            if not row[j]: continue
            val = float(row[j].replace('%', ''))
            
            if j in [8, 9, 10, 11, 12]: # B1, B2, B3, B5, B6
                row[j] = str(round(val / 1.19, 4)) + '%'
            elif j == 14: # Folate
                row[j] = str(round((val / 1.12) * 0.8, 4)) + '%'
            elif j == 16: # Vit C
                row[j] = str(round((val / 1.05) * 0.8, 4)) + '%'
            else:
                row[j] = str(round(val / 1.4, 4)) + '%'

with open(output_file, 'w', encoding='utf-8', newline='') as f:
    writer = csv.writer(f)
    writer.writerows(reader)
