import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from "@angular/core";
import { WebrtcService } from "../../_services/webrtc.service";
import {MatDialog} from '@angular/material/dialog';
import {environment} from '../../../environments/environment';
import {Message} from '../../model/message' ;
import { CallDialogComponent } from '../call-dialog/call-dialog.component';
import { ActivatedRoute } from "@angular/router";
import { CookieService } from 'ngx-cookie-service';
export const ENV_RTCPeerConfiguration = environment.RTCPeerConfiguration;

const offerOptions = {
  offerToReceiveAudio: true,
  offerToReceiveVideo: true,
};
const mediaConstrainsts  = {
  audio :true ,
  video:{width :720 , height:548}
}

@Component({
  selector: 'app-room',
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.css']
})
export class RoomComponent   implements AfterViewInit   {
  @ViewChild("local_video") localVideo!: ElementRef ;
  @ViewChild("received_video") remoteVideo!: ElementRef;
  private conversationId : any ;
  private peerConnection!: RTCPeerConnection | null ;  

  private localStream!: MediaStream;

  inCall = false;
  localVideoActive = false;


  constructor(private dataService: WebrtcService,private dialog: MatDialog,private route: ActivatedRoute ,private cookieService: CookieService) { 
    
  }


  async call(): Promise<void> {
    this.createPeerConnection();

    // Add the tracks from the local stream to the RTCPeerConnection
    this.localStream.getTracks().forEach(
      track => this.peerConnection!.addTrack(track, this.localStream)
    );

    try {
      const offer: RTCSessionDescriptionInit = await this.peerConnection!.createOffer(offerOptions);
      // Establish the offer as the local peer's current description.
      await this.peerConnection!.setLocalDescription(offer);

      this.inCall = true;

      this.dataService.sendMessage({type: 'offer',conversationId:this.conversationId, data: offer});
    } catch (err:any) {
      console.log("under this is the error")
      console.error(err)  ;
      this.handleGetUserMediaError(err);
    }
  }

  hangUp(): void {
    this.dataService.sendMessage({type: 'hangup',conversationId:this.conversationId, data: ''});
    this.closeVideoCall();
  }
  refuseCall():void{
this.dataService.sendMessage({type:'refuse' ,conversationId:this.conversationId, data:''})
this.closeVideoCall() ; 
  }

  ngAfterViewInit(): void {
    this.route.params.subscribe((params:any) => {
      this.conversationId= params['id'];})
    this.addIncominMessageHandler();
    this.requestMediaDevices();
  }

  private addIncominMessageHandler(): void {
    let jwtToken = this.cookieService.get('bezkoder-jwt');
    if(jwtToken.length == 0 )
    window.location.reload() ;
    console.log(jwtToken);
    this.dataService.connect();

    // this.transactions$.subscribe();
    this.dataService.messages$.subscribe(
      (msg:any) => {
        // console.log('Received message: ' + msg.type);
        switch (msg.type) {
          case 'offer':
            this.handleOfferMessage(msg.data);
            break;
          case 'answer':
            this.handleAnswerMessage(msg.data);
            break;
          case 'hangup':
            this.handleHangupMessage(msg);
            break;
            case 'refuse':
              this.handleRefuseMessage(msg);
              break;
          case 'ice-candidate':
            this.handleICECandidateMessage(msg.data);
            break;
          default:
            console.log('unknown message of type ' + msg.type);
        }
      },
      (error:any) => console.log(error)
    );
  }

  /* ########################  MESSAGE HANDLER  ################################## */

  private handleOfferMessage(msg: RTCSessionDescriptionInit): void {
    console.log('handle incoming offer');

    let dialogRef = this.dialog.open(CallDialogComponent, {
      height: '400px',
      width: '600px', // Set the width as per your requirement
    });
  
    dialogRef.afterClosed().subscribe((result:any) => {
      if (result === 'refuse') {
      this.refuseCall() ; 

      } else if (result === 'create-peer-connection') {
        if (!this.peerConnection) {
          this.createPeerConnection();
     
        }
    
        if (!this.localStream) {
          this.startLocalVideo();
        }
    
        this.peerConnection!.setRemoteDescription(new RTCSessionDescription(msg))
          .then(() => {
    
            // add media stream to local video
            this.localVideo.nativeElement.srcObject = this.localStream;
    
            // add media tracks to remote connection
            this.localStream.getTracks().forEach(
              track => this.peerConnection!.addTrack(track, this.localStream)
            );
    
          }).then(() => {
    
          // Build SDP for answer message
          return this.peerConnection!.createAnswer();
    
        }).then((answer) => {
    
          // Set local SDP
          return this.peerConnection!.setLocalDescription(answer);
    
        }).then(() => {
    
          // Send local SDP to remote party
          this.dataService.sendMessage({type: 'answer',conversationId:this.conversationId, data: this.peerConnection!.localDescription});
    
          this.inCall = true;
    
        }).catch(this.handleGetUserMediaError);
      }
    });
  }

  private handleAnswerMessage(msg: RTCSessionDescriptionInit): void {
    console.log('handle incoming answer');
    this.peerConnection!.setRemoteDescription(msg);
  }

  private handleHangupMessage(msg: Message): void {
    console.log(msg);
    this.closeVideoCall();
  }

  private handleRefuseMessage(msg:Message):void{
    console.log(msg);
    this.closeVideoCall();
  }

  private handleICECandidateMessage(msg: RTCIceCandidate): void {
    const candidate = new RTCIceCandidate(msg);
    this.peerConnection!.addIceCandidate(candidate).catch(this.reportError);
  }

  private async requestMediaDevices(): Promise<void> {
    try {
      this.localStream = await navigator.mediaDevices.getUserMedia(mediaConstrainsts);
      // pause all tracks
      this.pauseLocalVideo();
    } catch (e:any) {
      console.error(e);
      alert(`getUserMedia() error: ${e.name}`);
    }
  }

  startLocalVideo(): void {
    console.log('starting local stream');
    this.localStream.getTracks().forEach(track => {
      track.enabled = true;
    });
    this.localVideo.nativeElement.srcObject = this.localStream;

    this.localVideoActive = true;
  }

  pauseLocalVideo(): void {
    console.log('pause local stream');
    this.localStream.getTracks().forEach(track => {
      track.enabled = false;
    });
    this.localVideo.nativeElement.srcObject = undefined;

    this.localVideoActive = false;
  }

  private async createPeerConnection(): Promise<void> {
    console.log('creating PeerConnection...');
    this.peerConnection = new RTCPeerConnection(ENV_RTCPeerConfiguration);

    this.peerConnection.onicecandidate = this.handleICECandidateEvent;
    this.peerConnection.oniceconnectionstatechange = this.handleICEConnectionStateChangeEvent;
    this.peerConnection.onsignalingstatechange = this.handleSignalingStateChangeEvent;
   // await this._getStreams(this.remoteVideo);

    this.peerConnection.ontrack = this.handleTrackEvent;
  }

  private closeVideoCall(): void {
    console.log('Closing call');

    if (this.peerConnection) {
      console.log('--> Closing the peer connection');

      this.peerConnection.ontrack = null;
      this.peerConnection.onicecandidate = null;
      this.peerConnection.oniceconnectionstatechange = null;
      this.peerConnection.onsignalingstatechange = null;

      // Stop all transceivers on the connection
      this.peerConnection.getTransceivers().forEach(transceiver => {
        transceiver.stop();
      });

      // Close the peer connection
      this.peerConnection.close();
      this.peerConnection = null ;

      this.inCall = false;
    }
  }

  /* ########################  ERROR HANDLER  ################################## */
  private handleGetUserMediaError(e: Error): void {
    switch (e.name) {
      case 'NotFoundError':
        alert('Unable to open your call because no camera and/or microphone were found.');
        break;
      case 'SecurityError':
      case 'PermissionDeniedError':
        // Do nothing; this is the same as the user canceling the call.
        break;
      default:
        console.log(e);
        alert('Error opening your camera and/or microphone: ' + e.message);
        break;
    }

    this.closeVideoCall();
  }

  private reportError = (e: Error) => {
    console.log('got Error: ' + e.name);
    console.log(e);
  }

  /* ########################  EVENT HANDLER  ################################## */
  private handleICECandidateEvent = (event: RTCPeerConnectionIceEvent) => {
    // console.log(event);
    if (event.candidate) {
      this.dataService.sendMessage({
        type: 'ice-candidate',
        conversationId:this.conversationId,
        data: event.candidate
      });
    }
  }

  private handleICEConnectionStateChangeEvent = (event: Event) => {
    // console.log(event);
    switch (this.peerConnection!.iceConnectionState) {
      case 'closed':
      case 'failed':
      case 'disconnected':
        this.closeVideoCall();
        break;
    }
  }

  private handleSignalingStateChangeEvent = (event: Event) => {
   // console.log(event);
    switch (this.peerConnection!.signalingState) {
      case 'closed':
        this.closeVideoCall();
        break;
    }
  }

  private handleTrackEvent = (event: RTCTrackEvent) => {
    console.log("this trackEvent" + event) ;
    console.log(event.streams[0]);
    if(this.remoteVideo != undefined){
    this.remoteVideo.nativeElement.srcObject = event.streams[0];

    }
  }


  

  // private async _getStreams(remoteVideo: ElementRef): Promise<void> {
  //   const stream = await navigator.mediaDevices.getUserMedia({
  //     video: true,
  //     audio: true,
  //   });
  //   const remoteStream = new MediaStream();

  //   remoteVideo.nativeElement.srcObject = remoteStream;

  //   this.peerConnection!.ontrack = (event:any) => {
  //     console.log(event) ;
  //     event.streams[0].getTracks().forEach((track:any) => {
  //       remoteStream.addTrack(track);
  //     });
  //   };

  //   stream.getTracks().forEach((track) => {
  //     this.peerConnection!.addTrack(track, stream);
  //   });
  // }

}
