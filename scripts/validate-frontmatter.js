const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');
const glob = require('glob');

// Find all markdown files in the src directory
const markdown_files = glob.sync('src/**/*.md');

let errors = 0;

markdown_files.forEach(filePath => {
  console.log(`Checking ${filePath}...`);
  
  // Read the file
  const content = fs.readFileSync(filePath, 'utf8');
  
  // Check for frontmatter
  const frontmatterRegex = /^---\n([\s\S]*?)\n---/;
  const match = content.match(frontmatterRegex);
  
  if (!match) {
    console.error(`  ERROR: No frontmatter found in ${filePath}`);
    errors++;
    return;
  }
  
  try {
    // Parse the frontmatter
    const frontmatter = yaml.load(match[1]);
    
    // Basic validation - we'll add more specific checks later
    if (!frontmatter) {
      console.error(`  ERROR: Empty frontmatter in ${filePath}`);
      errors++;
    }
    
    // Check for version in RAG files
    if (filePath.includes('/RAG/') && !frontmatter.version) {
      console.error(`  WARNING: Missing version in RAG file ${filePath}`);
    }
    
  } catch (e) {
    console.error(`  ERROR: Invalid frontmatter in ${filePath}: ${e.message}`);
    errors++;
  }
});

console.log(`\nValidation complete. Found ${errors} errors.`);
if (errors > 0) {
  process.exit(1);
} else {
  console.log('All files passed validation!');
}