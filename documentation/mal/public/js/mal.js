document.addEventListener('DOMContentLoaded', async function () {

    const challenge_btn = document.getElementById('challenge_btn');
    const challenge_txt = document.getElementById('challenge_txt');
    const copy_btn = document.getElementById('copy_btn');
    const auth_url = document.getElementById('auth_url');

    challenge_btn.addEventListener('click', async () => {
        const res = await fetch('/code_challenge');
        const code_challenge = (await res.json()).code_challenge;

        challenge_txt.textContent = code_challenge;
        copy_btn.removeAttribute('style');
        copy_btn.addEventListener('click', navigator.clipboard.writeText(code_challenge));
        auth_url.removeAttribute('style');
        auth_url.setAttribute('href', `https://myanimelist.net/v1/oauth2/authorize?response_type=code&client_id=29420f00349900a89dee84f3fe1375f9&state=sus&code_challenge=${code_challenge}`);
    });
});
