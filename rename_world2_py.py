import os
import unicodedata

base_dir = '/Users/dandan/Desktop/dan-dan-app_1229 복사본/public/images/웹툰'

for unit in range(4, 21):
    unit_str = str(unit).zfill(2)
    folder_name = f'세계문학2_{unit_str}'
    folder_path = os.path.join(base_dir, folder_name)

    if not os.path.exists(folder_path):
        print(f'❌ 폴더 없음: {folder_name}')
        continue

    print(f'\n📁 처리 중: {folder_name}')

    for filename in os.listdir(folder_path):
        # NFC 정규화
        nfc_name = unicodedata.normalize('NFC', filename)

        # 세계문학(2)_XX.jpg → 세계문학2_XX.jpg
        if '세계문학(2)_' in nfc_name and nfc_name.endswith('.jpg'):
            new_name = nfc_name.replace('세계문학(2)_', '세계문학2_')
            old_path = os.path.join(folder_path, filename)
            new_path = os.path.join(folder_path, new_name)

            os.rename(old_path, new_path)
            print(f'   ✅ {nfc_name} → {new_name}')

print('\n✅ 파일명 변경 완료!')
