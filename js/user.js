async function postAnimeUpdate(variables) {
    const url = "https://www.livechart.me/graphql";
    const csrfToken = document.querySelector("meta[name='csrf-token']").content;
    const data = {
        operationName: "UpsertLibraryEntry",
        variables: variables,
        query: "mutation UpsertLibraryEntry($animeId: ID!, $attributes: LibraryEntryAttributes!) { upsertLibraryEntry(_animeId: $animeId, attributes: $attributes) { libraryEntry { animeDatabaseId episodesWatched status rating __typename } problems { ... on Problem { message path __typename } __typename } __typename }}"
    };
    const res = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "x-csrf-token": csrfToken
        },
        body: JSON.stringify(data)
    });
    return res.json();
}

async function updateAnime(animeId, episodesWatched, rating = null, status = "WATCHING") {
    const userData = {
        animeId: animeId,
        attributes: {
            episodesWatched: episodesWatched,
            rating: rating,
            status: status
        }
    };
    const res = await postAnimeUpdate(userData);
    console.log(res);

    const animeRow = document.querySelector(`tr[data-user-library-anime-id="${animeId}"]`);
    animeRow.querySelector("span[data-user-library-anime-target='episodeProgress']").textContent = episodesWatched;
    animeRow.querySelector("span.library__user-rating").textContent = rating ? rating : "–";
    animeRow.querySelector("use.primary-path").setAttribute("href", `#icon:mark:${status.toLowerCase()}`);
    //todo change input fields in modal if/when opened?
}

updateAnime(10781, 8);

const titleToId = [...document.getElementsByTagName("tr")].reduce((prev, curr) => {
    const animeTitle = curr.getAttribute("data-user-library-anime-title");
    const animeId = curr.getAttribute("data-user-library-anime-id");
    prev[animeTitle] = animeId;
    return prev;
}, {});
console.log(Object.keys(titleToId));
