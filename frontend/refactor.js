// refactor.js
const fs = require('fs');
const path = require('path');

const WIZARD_DIR = path.join(__dirname, 'src', 'features', 'workbench', 'components', 'wizard');
const PROJECT_DIR = path.join(WIZARD_DIR, 'project');
const SUPPLY_DIR = path.join(WIZARD_DIR, 'supply');

console.log('🏗️  INITIALIZING SHIFT STUDIO ARCHITECTURE REFACTOR...\n');

// 1. Create the new directories
console.log('📁 Creating new sector folders...');
[PROJECT_DIR, SUPPLY_DIR].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    console.log(`  ✅ Created: ${path.basename(dir)}/`);
  }
});

// 2. Define the files to move into the 'project' folder
const projectFiles = [
  'ProjectWizard.jsx',
  'ProjectWizard.css',
  'Step1Identity.jsx',
  'Step2Product.jsx',
  'Step3Fulfillment.jsx',
  'Step4CheckIn.jsx',
  'WizardStepper.jsx',
  'WizardStepper.css'
];

// 3. Move the files safely
console.log('\n📦 Migrating Project Builder files...');
projectFiles.forEach(file => {
  const oldPath = path.join(WIZARD_DIR, file);
  const newPath = path.join(PROJECT_DIR, file);
  
  if (fs.existsSync(oldPath)) {
    fs.renameSync(oldPath, newPath);
    console.log(`  ✅ Moved: ${file} -> project/${file}`);
  } else {
    console.log(`  ⚠️  Skipped: ${file} (Not found in root wizard folder)`);
  }
});

// 4. Scaffold the Supply Wizard blank files
console.log('\n🏗️  Scaffolding Supply Intake module...');
const supplyFiles = ['SupplyWizard.jsx', 'Step1Details.jsx', 'Step2Finance.jsx'];
supplyFiles.forEach(file => {
  const filePath = path.join(SUPPLY_DIR, file);
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, `/* src/features/workbench/components/wizard/supply/${file} */\nimport React from 'react';\n\nexport const ${file.replace('.jsx', '')} = () => {\n  return <div>${file.replace('.jsx', '')} Placeholder</div>;\n};\n`);
    console.log(`  ✅ Scaffolded: supply/${file}`);
  }
});

console.log('\n🚀 ARCHITECTURE REFACTOR COMPLETE!');
console.log('Your wizard folder is now split into /project and /supply.');