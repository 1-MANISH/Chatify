

const keyStrokeSounds = [
        new Audio("/sounds/keystroke1.mp3"),
        new Audio("/sounds/keystroke2.mp3"),
        new Audio("/sounds/keystroke3.mp3"),
        new Audio("/sounds/keystroke4.mp3"),
]


function useKeyBoardSound(){

        const playRandomKeyStrokeSound = () => {

                const randomIndex = Math.floor(Math.random() * keyStrokeSounds.length);
                const randomSound = keyStrokeSounds[randomIndex];

                randomSound.currentTime = 0 ;// this is for better user experience 
                randomSound.play().catch(err=>{
                        console.log(`Error playing sound: ${err}`)
                })
        }

        return {playRandomKeyStrokeSound}
}

export default useKeyBoardSound