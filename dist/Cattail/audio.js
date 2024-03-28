export class CattailAudio {
    audioElement;
    audioContext = new AudioContext();
    player;
    clips = new Array();
    constructor(element) {
        this.audioElement = element;
        this.player = this.audioContext.createMediaElementSource(this.audioElement);
        this.player.connect(this.audioContext.destination);
    }
    loadSound(url, looped) {
        let nClip = new AudioClip(url, looped, this);
        this.clips.push(nClip);
        return nClip;
    }
    async resumeAllSound() {
        this.clips.forEach((clip) => {
            clip.resume();
        });
    }
}
class AudioClip {
    clipUrl;
    element;
    context;
    loadSuspension = false;
    constructor(url, looped, context) {
        this.clipUrl = url;
        this.element = document.createElement("audio");
        this.element.src = this.clipUrl;
        this.element.autoplay = true;
        this.element.loop = looped;
        document.body.append(this.element);
        this.context = context;
    }
    play() {
        if (this.context.audioContext.state == "suspended") {
            this.loadSuspension = true;
            return;
        }
        this.element.play();
    }
    pause() {
        this.element.pause();
    }
    async resume() {
        await this.context.audioContext.resume();
        if (this.loadSuspension) {
            this.element.play();
            this.loadSuspension = false;
        }
    }
}
