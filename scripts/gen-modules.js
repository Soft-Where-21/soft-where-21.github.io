const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

const docsDir = path.join(__dirname, '../docs');
const outputFile = path.join(__dirname, '../src/data/modules.json');

function getFiles(dir, relativePath = '') {
  const results = [];
  const list = fs.readdirSync(dir);

  list.forEach(file => {
    const fullPath = path.join(dir, file);
    const stats = fs.statSync(fullPath);
    const currentRelativePath = path.join(relativePath, file);

    if (stats.isDirectory()) {
      // Check for _category_.json to get category info
      const categoryFile = path.join(fullPath, '_category_.json');
      let categoryTitle = file;
      let categoryDescription = `关于 ${file} 的相关资料。`;
      
      if (fs.existsSync(categoryFile)) {
        const categoryData = JSON.parse(fs.readFileSync(categoryFile, 'utf8'));
        categoryTitle = categoryData.label || categoryTitle;
        categoryDescription = categoryData.description || categoryDescription;
      }

      // Add category itself
      results.push({
        title: categoryTitle,
        description: categoryDescription,
        link: `/docs/category/${currentRelativePath.replace(/\\/g, '/')}`,
        isCategory: true,
        items: getFiles(fullPath, currentRelativePath) // Recursive call for sub-items
      });
    } else if (file.endsWith('.md') || file.endsWith('.mdx')) {
      // Exclude special files
      if (file === 'intro.md' || file === 'intro.mdx' || file === '贡献指南.mdx' || file === '_category_.json') return;
      
      const fileContent = fs.readFileSync(fullPath, 'utf8');
      const { data } = matter(fileContent);
      const name = currentRelativePath.replace(/\.mdx?$/, '').replace(/\\/g, '/');
      
      results.push({
        title: data.title || data.sidebar_label || file.replace(/\.mdx?$/, ''),
        description: data.description || `查看 ${data.title || file} 详情。`,
        link: `/docs/${name}`,
        isCategory: false
      });
    }
  });

  return results;
}

const modules = getFiles(docsDir);

if (!fs.existsSync(path.dirname(outputFile))) {
  fs.mkdirSync(path.dirname(outputFile), { recursive: true });
}
fs.writeFileSync(outputFile, JSON.stringify(modules, null, 2));
console.log(`Successfully generated hierarchical modules to ${outputFile}`);
