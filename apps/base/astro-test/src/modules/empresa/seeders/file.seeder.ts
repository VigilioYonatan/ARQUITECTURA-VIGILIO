export async function fileSeeder() {
	// const temp_path = `${dirMode}/src/assets/temp`;

	// Leer archivos de temp
	// const files = await fs.promises.readdir(temp_path);

	// const filePublic = `${pathUploads()}/files/file`;
	// // await fs.promises.unlink(filePublic);
	// // Si no existe la carpeta, eliminarla
	// if (!(await fileExists(filePublic))) {
	//     // Crear carpeta destino
	//     await fs.promises.mkdir(filePublic, { recursive: true });
	// }

	// // Mover archivos
	// const result: { name: string; file: string; size: number }[] = [];

	// for await (const file of files) {
	//     const filePath = `${filePublic}/${file}`;
	//     Logger.info({ filePath });
	//     // solo archivos que no existan se podran, puede que ya existan en la carpeta de archivos
	//     if (!(await fileExists(filePath))) {
	//         const src = path.join(temp_path, file);
	//         const dest = path.join(filePublic, file);
	//         const stats = await fs.promises.stat(src);
	//         await fs.promises.copyFile(src, dest);
	//         // Guardar solo el nombre sin extensión
	//         result.push({
	//             name: path.parse(file).name,
	//             file: `files/file/${file}`,
	//             size: stats.size,
	//         });
	//     }
	// }

	return [];
}
