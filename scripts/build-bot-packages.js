const fs = require('fs');
const path = require('path');
const glob = require('glob');

// Configuration for each bot
const botConfigs = {
  'lilith-bot': {
    character: '**/Lilith_Ravenna_Blackwood_RAG.md',
    locations: ['**/Library_of_Shadows_RAG.md'],
    extraContent: ['**/Supernatural_Elements_RAG.md']
  },
  'val-bot': {
    character: '**/Val_Blackfin_RAG.md',
    locations: ['**/Ravenwood_Lake_RAG.md'],
    extraContent: []
  },
  'primrose-bot': {
    character: '**/Primrose_Brightly_RAG.md',
    locations: [],
    extraContent: []
  }
};

// Generate a combined file for each bot
for (const [bot, config] of Object.entries(botConfigs)) {
  console.log(`Generating package for ${bot}...`);
  
  let content = `# ${bot.split('-')[0].toUpperCase()} BOT PACKAGE\n\n`;
  content += `Generated: ${new Date().toISOString()}\n\n`;
  
  // Add character content
  const characterFiles = glob.sync(`src/RAG/${config.character}`);
  if (characterFiles.length > 0) {
    content += `## CHARACTER\n\n`;
    characterFiles.forEach(file => {
      const fileContent = fs.readFileSync(file, 'utf8');
      // Strip frontmatter for the package
      content += fileContent.replace(/^---\n[\s\S]*?\n---\n/, '') + '\n\n';
    });
  }
  
  // Add locations
  if (config.locations.length > 0) {
    content += `## LOCATIONS\n\n`;
    config.locations.forEach(pattern => {
      const files = glob.sync(`src/RAG/${pattern}`);
      files.forEach(file => {
        const fileContent = fs.readFileSync(file, 'utf8');
        const fileName = path.basename(file, '.md').replace('_RAG', '');
        content += `### ${fileName.replace(/_/g, ' ')}\n\n`;
        content += fileContent.replace(/^---\n[\s\S]*?\n---\n/, '') + '\n\n';
      });
    });
  }
  
  // Add extra content
  if (config.extraContent.length > 0) {
    content += `## ADDITIONAL INFORMATION\n\n`;
    config.extraContent.forEach(pattern => {
      const files = glob.sync(`src/RAG/${pattern}`);
      files.forEach(file => {
        const fileContent = fs.readFileSync(file, 'utf8');
        const fileName = path.basename(file, '.md').replace('_RAG', '');
        content += `### ${fileName.replace(/_/g, ' ')}\n\n`;
        content += fileContent.replace(/^---\n[\s\S]*?\n---\n/, '') + '\n\n';
      });
    });
  }
  
  // Write the combined file
  const outputDir = path.join('dist', 'chatbot-packages', bot);
  fs.mkdirSync(outputDir, { recursive: true });
  const outputPath = path.join(outputDir, 'combined.md');
  fs.writeFileSync(outputPath, content);
  
  console.log(`  Generated: ${outputPath}`);
}

console.log('All bot packages generated successfully!');