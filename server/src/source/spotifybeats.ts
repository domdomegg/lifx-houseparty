import { App, Source } from '../app';
import axios from 'axios';

interface SpotifyInterval {
    start: number;
    duration: number;
    confidence: number;
}

export class SpotifyBeats implements Source {
    static key: string = 'spotifyBeats';
    key: string = SpotifyBeats.key;

    private options: { accessToken?: string } = {};

    private refreshInterval: NodeJS.Timeout;
    private currentSongId: string;
    private beatTimeouts: NodeJS.Timeout[] = [];

    setup(app: App) {
        if (this.options.accessToken) this.refreshInterval = setInterval(() => this.refreshBeats(app), 5000);
    }

    onData(app: App, data: any) {
        this.options = data;
        clearInterval(this.refreshInterval);

        if (this.options.accessToken) this.refreshInterval = setInterval(() => this.refreshBeats(app), 5000);
    }

    teardown(app: App) {
        clearInterval(this.refreshInterval);
        this.beatTimeouts.forEach(clearTimeout);
        this.beatTimeouts = [];
    }

    refreshBeats(app: App) {        
        axios.get('https://api.spotify.com/v1/me/player/currently-playing', { headers: {
            'Accept': 'application/json',
            'Authorization': 'Bearer ' + this.options.accessToken
        }}).then(currentlyPlayingResponse => {
            const progressReceivedAt: number = new Date().getTime();
            const progress: number = currentlyPlayingResponse.data.progress_ms;
            const trackId: string = currentlyPlayingResponse.data.item.id;
            
            if (this.currentSongId == trackId) return;
            
            this.beatTimeouts.forEach(clearTimeout);
            this.beatTimeouts = [];
            
            axios.get('https://api.spotify.com/v1/audio-analysis/' + trackId, { headers: {
                'Accept': 'application/json',
                'Authorization': 'Bearer ' + this.options.accessToken
            }}).then(audioAnalysisResponse => {
                const intervals: SpotifyInterval[] = audioAnalysisResponse.data.tatums;
                
                const currentProgressInSeconds = (progress + (new Date().getTime() - progressReceivedAt)) / 1000;
                this.beatTimeouts = intervals
                    .filter(beat => beat.start > currentProgressInSeconds)
                    .map(beat => setTimeout(() => app.handleBeat(), 1000 * (beat.start - currentProgressInSeconds)));
                
                this.currentSongId = trackId;
            })
        })
    }
}
