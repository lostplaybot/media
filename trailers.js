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
					try {
						const res = await fetch(url, {
							headers: { "X-Access-Key": ACCESS_KEY }
						});
						if (!res.ok) throw new Error(`Доступ запрещён (${res.status})`);
						const blob = await res.blob();
						const blobUrl = URL.createObjectURL(new Blob([blob], { type: "video/mp4" }));

						const video = document.createElement("video");
						video.src = blobUrl;
						video.controls = true;
						video.autoplay = true;
						video.style.width = "80vw";
						video.style.maxHeight = "80vh";

						const modal = document.createElement("div");
						modal.style.position = "fixed";
						modal.style.top = 0;
						modal.style.left = 0;
						modal.style.width = "100%";
						modal.style.height = "100%";
						modal.style.background = "rgba(0,0,0,0.8)";
						modal.style.display = "flex";
						modal.style.alignItems = "center";
						modal.style.justifyContent = "center";
						modal.style.zIndex = 10000;
						modal.appendChild(video);

						modal.addEventListener("click", e => {
							if (e.target === modal) {
								video.pause();
								URL.revokeObjectURL(blobUrl);
								modal.remove();
							}
						});

						document.body.appendChild(modal);
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
