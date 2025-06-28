const fetch = require("node-fetch");
const fs = require("fs");

const owner = "lostplaybot";
const repo = "media";
const tag = "trailer";
const proxyBase = "https://trailer.lostplay.workers.dev";
const accessKey = process.env.TRAILER_ACCESS_KEY;

async function fetchReleaseAssets() {
	const url = `https://api.github.com/repos/${owner}/${repo}/releases/tags/${tag}`;
	const res = await fetch(url, {
		headers: {
			Accept: "application/vnd.github+json",
			"User-Agent": "GitHub Action",
			Authorization: `token ${process.env.GITHUB_TOKEN}`,
		},
	});
	if (!res.ok) throw new Error(`GitHub API error: ${res.status}`);
	const data = await res.json();
	return data.assets
		.map(asset => `${proxyBase}/${asset.name}?key=${accessKey}`)
		.filter(link => link.endsWith(".mp4"));
}

async function main() {
	try {
		const links = await fetchReleaseAssets();
		fs.writeFileSync("trailers.json", JSON.stringify(links, null, 2), "utf-8");
		console.log("trailers.json обновлён");
	} catch (e) {
		console.error("Ошибка:", e.message);
		process.exit(1);
	}
}

main();
