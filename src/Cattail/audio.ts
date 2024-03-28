export class CattailAudio
{
    private audioElement: HTMLAudioElement;
    public audioContext: AudioContext = new AudioContext();
    public player : MediaElementAudioSourceNode;
    private clips : Array<AudioClip> = new Array<AudioClip>();
    constructor(element: HTMLAudioElement)
    {  
        this.audioElement = element;
        this.player = this.audioContext.createMediaElementSource(this.audioElement);
        this.player.connect(this.audioContext.destination);
    }
    public loadSound(url: string, looped: boolean)
    {
        let nClip = new AudioClip(url, looped, this);
        this.clips.push(nClip);
        return nClip;
    }
    public async resumeAllSound()
    {
        this.clips.forEach((clip) => {
            clip.resume();
        });
    }
}
class AudioClip
{
    public clipUrl : string;
    public element : HTMLAudioElement;
    private context : CattailAudio;
    private loadSuspension : boolean = false;
    constructor(url: string, looped: boolean, context: any)
    {
        this.clipUrl = url;
        this.element = document.createElement("audio");
        this.element.src = this.clipUrl;
        this.element.autoplay = true;
        this.element.loop = looped;
        document.body.append(this.element);
        this.context = context;
    }
    public play()
    {
        if(this.context.audioContext.state == "suspended")
        {
            this.loadSuspension = true;
            return;
        }
        this.element.play();
    }
    public pause()
    {
        this.element.pause();
    }
    public async resume()
    {
        await this.context.audioContext.resume();
        if(this.loadSuspension)
        {
            this.element.play();
            this.loadSuspension = false;
        }
    }
}