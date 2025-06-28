const keyInput = document.getElementById("keyInput");
const loadBtn = document.getElementById("loadBtn");
const container = document.getElementById("list");

let ACCESS_KEY = "";

loadBtn.addEventListener("click", () => {
	ACCESS_KEY = keyInput.value.trim();
	if (!ACCESS_KEY) {
		alert("Ключ обязателен");
		return;
	}

	fetch("trailers.json")
		.then(res => res.json())
		.then(files => {
			container.innerHTML = "";
			files.forEach(filename => {
				const url = `https://trailer.lostplay.workers.dev/${filename}`;

				const btn = document.createElement("button");
				btn.textContent = filename.replace(/\.mp4$/i, "");
				btn.className = "trailer-btn";

				btn.addEventListener("click", async () => {
					console.log("Запрос с ключом:", ACCESS_KEY);
					try {
						const res = await fetch(url, {
							headers: { "X-Access-Key": ACCESS_KEY }
						});
						if (!res.ok) throw new Error(`Доступ запрещён (${res.status})`);
						const blob = await res.blob();
						const blobUrl = URL.createObjectURL(blob);
						window.open(blobUrl, "_blank");
					} catch (e) {
						alert("Ошибка доступа или загрузки: " + e.message);
					}
				});

				container.appendChild(btn);
			});
		})
		.catch(() => {
			container.textContent = "Ошибка загрузки списка.";
		});
});
