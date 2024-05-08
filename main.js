let audio = document.querySelector('.quranPlayer'),
    surahsContainer = document.querySelector('.surahs'),
    ayah = document.querySelector('.ayah'),
    next = document.querySelector('.next'),
    prev = document.querySelector('.prev'),
    play = document.querySelector('.play');

getSurahs();

function getSurahs() {
    // fetch to get surah data
    fetch('https://api.quran.gading.dev/surah')
        .then(response => response.json())
        .then(data => {
            // console.log(data);
            for (let surah in data.data) {
                // console.log(surah);
                surahsContainer.innerHTML +=
                    `
                    <div>
                        <p>${data.data[surah].name.long}</p>
                        <p>${data.data[surah].name.transliteration.en}</p>
                    </div>
                    `
            }
            // select all surah
            let allSurahs = document.querySelectorAll('.surahs div'),
                AyahsAudios,
                AyahsText;

            function changeAyah(index) {
                audio.src = AyahsAudios[index];
                ayah.innerHTML = AyahsText[index];
            }

            allSurahs.forEach((surah, index) => {
                surah.addEventListener('click', () => {
                    fetch(`https://api.quran.gading.dev/surah/${index + 1}`)
                        .then(response => response.json())
                        .then(data => {
                            let verses = data.data.verses;
                            AyahsAudios = [];
                            AyahsText = [];
                            verses.forEach(verse => {
                                AyahsAudios.push(verse.audio.primary);
                                AyahsText.push(verse.text.arab);
                            });

                            let AyahIndex = 0;
                            changeAyah(AyahIndex);

                            audio.addEventListener('ended', () => {
                                AyahIndex++;
                                if (AyahIndex < AyahsAudios.length) {
                                    changeAyah(AyahIndex);
                                } else {
                                    AyahIndex = 0;
                                    changeAyah(AyahIndex);
                                    audio.pause();
                                    Swal.fire({
                                        position: 'center',
                                        icon: 'success',
                                        title: 'surah has been ended',
                                        showConfirmButton: false,
                                        timer: 1500
                                    });
                                    isPlaying = true;
                                    togglePlay();
                                }
                            });

                            // handle next and prev buttons
                            next.addEventListener('click', () => {
                                AyahIndex < AyahsAudios.length ? AyahIndex++ : AyahIndex = 0;
                                // last index =6
                                changeAyah(AyahIndex);
                            });

                            prev.addEventListener('click', () => {
                                AyahIndex == 0 ? AyahIndex = AyahsAudios.length - 1 : AyahIndex--;
                                changeAyah(AyahIndex);
                            });

                            // handle play and pause audio
                            let isPlaying = false;

                            function togglePlay() {
                                if (isPlaying) {
                                    audio.pause();
                                    play.innerHTML = `<i class="fas fa-play"></i>`;
                                    isPlaying = false;
                                } else {
                                    audio.play();
                                    play.innerHTML = `<i class="fas fa-pause"></i>`;
                                    isPlaying = true;
                                }
                            }

                            togglePlay();
                            play.addEventListener('click', togglePlay);
                        });
                });
            });
        });
}