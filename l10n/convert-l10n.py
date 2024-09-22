#!/usr/bin/env python3
import sys
import csv
import re
import os
import json

locales = ['pt-br', 'de']


def main():
    script_path = os.path.abspath(os.path.dirname(sys.argv[0]))
    l10n_file = os.path.join(script_path, 'l10n.csv')
    base_path = os.path.abspath(os.path.join(script_path, '..'))

    vsx_package_path = os.path.join(base_path, 'vsx')
    package_file = os.path.join(vsx_package_path, 'package.nls.json')
    xed_plugins_path = os.path.join(base_path, 'linux/usr/share/editortoix/xed/plugins')
    xed_messages_path = os.path.join(xed_plugins_path, 'toix_proxy/locale')

    with open(package_file, 'r', encoding='utf-8') as json_f:
        l10n_data = json.load(json_f)

    with open(l10n_file, 'r', encoding='utf-8') as map_f:
        reader = csv.DictReader(map_f, delimiter='\t')
        headers = reader.fieldnames

        for locale in locales:
            lang = locale[0:2]

            translations = {}
            map_f.seek(0)
            for row in reader:
                key = row[headers[0]]
                translation = row[lang].rstrip()
                translation = translation if translation != '' else row['root']
                translations[key] = translation

            def vsx_replace(match):
                key = match.group(1).strip()
                return f'IX: {translations.get(key, key)}'

            # vsx

            data = dict(l10n_data)
            for key, value in data.items():
                if isinstance(value, str):
                    data[key] = re.sub(r'IX: ([^"]+)', vsx_replace, value)

            output_file = os.path.join(vsx_package_path, f'package.nls.{locale}.json')
            with open(output_file, 'w', encoding='utf-8') as out_f:
                json.dump(data, out_f, ensure_ascii=False, indent=2)

            print(f'File saved as: {output_file}')

            bundle_file = os.path.join(vsx_package_path, 'l10n', f'bundle.l10n.{locale}.json')
            with open(bundle_file, 'r', encoding='utf-8') as bundle_f:
                bundle_data = json.load(bundle_f)

            for key in bundle_data.keys():
                bundle_data[key] = translations.get(key, key)

            with open(bundle_file, 'w', encoding='utf-8') as bundle_out_f:
                json.dump(bundle_data, bundle_out_f, ensure_ascii=False, indent=2)

            print(f'File saved as: {bundle_file}')

            # xed

            def po_replace(match):
                [usage, plugin, msgid, msgstr] = [match.group(2), match.group(3), match.group(4), match.group(5)]
                if usage == 'desc':
                    plugin_descriptions[plugin] = msgstr
                elif usage == 'name':
                    plugin_names[plugin] = msgstr
                return (match.group(1) or "") + f'msgid "{msgid}"\nmsgstr "{translations[msgid]}"' \
                    if msgid in translations else match.group(0)

            xed_messages_file = os.path.join(xed_messages_path, f"{lang}/LC_MESSAGES/editortoix.po")
            plugin_names = {}
            plugin_descriptions = {}
            with open(xed_messages_file, 'r+', encoding='utf-8') as f:
                lines = f.read()
                f.seek(0)
                lines = re.sub(
                    r'(# plugin-(\w+): (\w+)\n)?msgid\s+"([^"]+)"\s*\nmsgstr\s+"([^"]+)"',
                    po_replace, lines, flags=re.DOTALL)
                f.write(lines)
                f.truncate()
                f.close()
            print(f'File saved as: {xed_messages_file}')

            for plugin_basename in os.listdir(xed_plugins_path):
                plugin = plugin_basename[5:]
                plugin_file = os.path.join(xed_plugins_path, plugin_basename, f'{plugin_basename}.plugin')
                if os.path.exists(plugin_file):
                    with open(plugin_file, 'r+', encoding='utf-8') as f:
                        lines = f.read()
                        f.seek(0)
                        lines = re.sub(fr'Name\[{lang}\]=IX: .*\nDescription\[{lang}\]=.*\n', "", lines)
                        lines += f'Name[{lang}]=IX: {plugin_names[plugin]}\n' + \
                            f'Description[{lang}]={plugin_descriptions[plugin]}\n'
                        f.write(lines)
                        f.truncate()
                        f.close()
                    print(f'File saved as: {plugin_file}')


if __name__ == '__main__':
    main()
