async function syncLivechart(malUser) {
    const mal = await getMalList(malUser);
    const livechart = getLivechartList();
    if (Object.keys(livechart).length === 0) {
        console.debug(`no watching anime or not own anime list`); //todo add popup?
        return;
    }
    for (const [key, data] of Object.entries(mal)) {
        if (livechart[key]) {
            if (livechart[key].episodes != data.episodes) {
                updateAnime(livechart[key].id, data.episodes); //todo update rating and status?
                console.debug(`updated ${data.title} aka ${livechart[key].title} episode ${livechart[key].episodes} --> ${data.episodes}`);
            }
            delete livechart[key];
        } else {
            console.debug(`not found ${data.title}`); //todo add popup?
        }
    }
    for (const data of Object.values(livechart)) {
        data.element.style.transition = "border 1s";
        data.element.style.border = "3px solid red";
        setTimeout(() => {
            data.element.style.border = "";
        }, 15000);
        console.debug(`not updated ${data.title}`);
    }
}

async function getMalList(malUser) {
    const res = await fetch(`https://api.myanimelist.net/v2/users/${malUser}/animelist?status=watching&limit=100&fields=list_status`, {
        headers: {
            "X-MAL-CLIENT-ID": "29420f00349900a89dee84f3fe1375f9"
        }
    });
    const mal = await res.json();
    return mal.data.reduce((prev, curr) => {
        const item = curr.node;
        const status = curr.list_status;
        prev[cleanAnimeTitle(item.title)] = {
            id: item.id,
            title: item.title,
            episodes: status.num_episodes_watched,
            score: status.score
        }
        return prev;
    }, {});
}

function getLivechartList() {
    return [...document.getElementsByTagName("tr")].reduce((prev, curr) => {
        if (curr.getAttribute("data-library-status") === "watching") {
            const title = curr.getAttribute("data-user-library-anime-title");
            const id = curr.getAttribute("data-user-library-anime-id");
            const episodes = curr.getAttribute("data-user-library-anime-episodes-watched");
            prev[cleanAnimeTitle(title)] = {
                id: id,
                title: title,
                episodes: episodes,
                element: curr
            }
        }
        return prev;
    }, {});
}

function cleanAnimeTitle(title) {
    return title.toLowerCase().replace(/[^0-9a-z!]+/gi, "");
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
    console.log(res); //todo validate res?

    const animeRow = document.querySelector(`tr[data-user-library-anime-id="${animeId}"]`);
    animeRow.querySelector("span[data-user-library-anime-target='episodeProgress']").textContent = episodesWatched;
    animeRow.querySelector("span.library__user-rating").textContent = rating ? rating : "–";
    animeRow.querySelector("use.primary-path").setAttribute("href", `#icon:mark:${status.toLowerCase()}`);
    //todo change input fields in modal if/when opened? //todo fix/hide increment button?
}

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

syncLivechart("Andiru"); //todo get username through a popup? //todo also enable update the other way around?
