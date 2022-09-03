document.addEventListener('DOMContentLoaded', async function () {

    // const token_btn = document.getElementById('token_btn');
    // const code_input = document.getElementById('code_input');
    const challenge_input = document.getElementById('challenge_input');

    // token_btn.addEventListener('click', async () => {
    //     const code = code_input.value;
    //     const code_challenge = challenge_input.value;
    //     const res = await fetch('https://myanimelist.net/v1/oauth2/token', {
    //         method: 'POST',
    //         headers: {
    //             'Content-Type': 'application/x-www-form-urlencoded'
    //         },
    //         body: `client_id=29420f00349900a89dee84f3fe1375f9&client_secret=437fb06489ff8e657773574ac4c86ff87becffb2ba5851aa6de2311d2658f016&grant_type=authorization_code&code=${code}&code_verifier=${code_challenge}`
    //     });
    //     console.log(await res.json());
    // });

    challenge_input.value = '';
});
