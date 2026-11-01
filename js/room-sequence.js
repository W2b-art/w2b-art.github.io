/* Shared count-agnostic room sequencer.
   Lifted verbatim from js/art-gallery.js (buildRoomSequence), where it
   still lives unchanged for the two room-system galleries it was proven
   on (contemplations, best-of). Pulled out here, byte-for-byte, so the
   home.html trunk/branch view (js/art-trunk.js) can reuse the exact same
   pacing logic without art-gallery.js's gallery-specific closure around
   it. Nothing in art-gallery.js was touched to make this possible.

   Works for 1 image or 30 — chunks a sequence greedily into rooms of
   1/2/3 images, never stranding a lone image inside a 2- or 3-up
   primitive, and drops in a periodic single-image "detail" pause for
   museum pacing. See the inline comments below (same as the original). */
(function(){
  function buildRoomSequence(n, preferAsym2){
    var out=[], i=0, toggle=0, sincePause=0;
    while(i<n){
      var remaining=n-i, take, type;
      /* museum pacing: every 3rd room, if there's still enough material
         to form a real room afterward, peel off a single image as a
         small "detail" pause — a genuine change of pace, not another
         full-weight group. Skips itself naturally on short sequences
         (sincePause never reaches 3 before n runs out). */
      if (sincePause>=3 && remaining>=3){ take=1; type='detail'; sincePause=0; }
      else if(remaining===1){ take=1; type='full'; }
      else if(remaining===2){ take=2; type= toggle%2?'asym2-rev':'asym2'; }
      else if(remaining===3){ take=3; type= toggle%2?'rhythm3-alt':'rhythm3'; }
      else if(remaining===4){ take=2; type= toggle%2?'asym2-rev':'asym2'; }
      else if(preferAsym2){ take=2; type= toggle%2?'asym2-rev':'asym2'; }
      else { take=3; type= toggle%2?'rhythm3-alt':'rhythm3'; }
      if (type!=='detail') sincePause++;
      out.push({type:type, start:i, count:take});
      i+=take; toggle++;
    }
    return out;
  }
  window.buildRoomSequence = buildRoomSequence;
})();
