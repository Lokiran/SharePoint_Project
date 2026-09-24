/* eslint-disable */
// One-off generator: reads the AMD loc/*.js files (the SPFx localizedResources
// source of truth) and emits directly-importable TS modules under loc/data/
// for use by the runtime language switcher. Re-run this whenever loc/*.js changes.
const fs = require('fs');
const path = require('path');

const locDir = path.join(__dirname, '..', 'src', 'webparts', 'inventoryManagement', 'loc');
const outDir = path.join(locDir, 'data');

const locales = ['en-us', 'pl-pl', 'sv-se', 'pt-pt'];

if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

for (const locale of locales) {
  const filePath = path.join(locDir, `${locale}.js`);
  const source = fs.readFileSync(filePath, 'utf8');

  let captured;
  const define = (_deps, factory) => {
    captured = factory();
  };
  // eslint-disable-next-line no-new-func
  const runner = new Function('define', source);
  runner(define);

  if (!captured) {
    throw new Error(`Failed to capture exported object from ${filePath}`);
  }

  const json = JSON.stringify(captured, null, 2);
  const varName = locale.replace(/-/g, '_');
  const tsContent = `/* AUTO-GENERATED from ../${locale}.js by scripts/generate-locale-data.js. Do not edit directly. */\nconst ${varName}: IInventoryManagementWebPartStrings = ${json};\n\nexport default ${varName};\n`;

  fs.writeFileSync(path.join(outDir, `${locale}.ts`), tsContent, 'utf8');
  console.log(`Generated loc/data/${locale}.ts`);
}
