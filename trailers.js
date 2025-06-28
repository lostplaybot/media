const ACCESS_KEY = "секретный_ключ_который_НЕ_в_json"; // замените на актуальный

const container = document.getElementById("list");

fetch("trailers.json")
	.then(r => r.json())
	.then(files => {
		container.innerHTML = "";
		files.forEach(filename => {
			const url = `https://trailer.lostplay.workers.dev/${filename}`;
			const a = document.createElement("a");
			a.textContent = filename.replace(/\.mp4$/i, "");
			a.href = url;
			a.target = "_blank";
			a.addEventListener("click", async e => {
				e.preventDefault();
				try {
					const res = await fetch(url, {
						headers: { "X-Access-Key": ACCESS_KEY }
					});
					if (!res.ok) throw new Error("Доступ запрещён");
					const blob = await res.blob();
					const blobUrl = URL.createObjectURL(blob);
					window.open(blobUrl, "_blank");
				} catch {
					alert("Ошибка доступа или загрузки");
				}
			});
			container.appendChild(a);
		});
	})
	.catch(() => {
		container.textContent = "Ошибка загрузки списка.";
	});
