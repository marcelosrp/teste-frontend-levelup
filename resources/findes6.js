const fs = require('fs')
const path = require('path')

function podeEntrar(dir) {
	const excluir = ['uploads', 'resources', '.git']
	return excluir.indexOf(dir.split('/').pop()) === -1
}

function walkDir(dir, callback) {
	fs.readdirSync(dir).forEach( f => {
		let dirPath = path.join(dir, f);
		let isDirectory = fs.lstatSync(dirPath).isDirectory() && !fs.lstatSync(dirPath).isSymbolicLink();

		isDirectory && podeEntrar(dirPath) ?
			walkDir(dirPath, callback) : callback(path.join(dir, f));
	});
}

const files = []
module.exports = (path) => {
	walkDir(path, (file) => {
		if (file.match(/\.es6\.js$/)) {
			files.push(file);
		}
	})
	return files
}