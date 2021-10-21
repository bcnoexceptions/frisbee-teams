export async function retrieveNRandomTitles(n = 10): Promise<string[]> {
	const url = `https://en.wikipedia.org/w/api.php?action=query&origin=*&list=random&format=json&rnnamespace=0&rnlimit=${n}`;

	const respObj = await fetch(url);
	const rawResults: WikipediaAPIResponse = await respObj.json();

	if (!rawResults?.query?.random) { return []; }
	return rawResults.query.random.map(pageListing => pageListing.title);
}

export interface WikipediaAPIResponse {
	batchcomplete: string;
	continue: object;  // optional todo
	query: QueryResult;
}

interface QueryResult {
	random: PageListing[];
}

interface PageListing {
	id: number;
	ns: number;
	title: string;
}

