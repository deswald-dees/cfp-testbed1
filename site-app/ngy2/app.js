document.addEventListener('alpine:init', () => {
  console.log('Alpine is ready!');

  lucide.createIcons();

  function loadAlbum(albumId) {
    const albumPath = 'albums/' + albumId + '.json';
    jQuery.getJSON(albumPath, function (data) {
      //Update the global store value
      Alpine.store('ngy').currentAlbum = albumId;
      Alpine.store('ngy').currentAlbumTitle = data.name;

      // Remap the json structure to fit the nano gallery object structure
      let nanoGalleryItems = jQuery.map(data.images, function (image, index) {
        return {
          src: image.src,
          srct: image.thumb,
          title: image.title
        }
      });

      jQuery("#nanogallery2").nanogallery2({
        // ### gallery settings ### 
        thumbnailHeight: 200, thumbnailWidth: 200,
        thumbnailAlignment: 'scaled',
        thumbnailGutterWidth: 0, thumbnailGutterHeight: 0,
        thumbnailBorderHorizontal: 0, thumbnailBorderVertical: 0,

        thumbnailToolbarImage: null,
        thumbnailToolbarAlbum: null,
        thumbnailLabel: { display: false },
        thumbnailDisplayOrder: 'random',

        // THUMBNAIL HOVER ANIMATION
        thumbnailBuildInit2: 'image_scale_1.15',
        thumbnailHoverEffect2: 'thumbnail_scale_1.00_1.05_300|image_scale_1.15_1.00',
        touchAnimation: true,
        touchAutoOpenDelay: 500,

        galleryMaxRows: 1,
        galleryDisplayMode: 'rows',
        gallerySorting: 'random',
        
        galleryMosaic: [
          { "c": 1, "r": 1, "w": 2, "h": 2 },
          { "c": 3, "r": 1, "w": 1, "h": 1 },
          { "c": 3, "r": 2, "w": 1, "h": 1 },
          { "c": 4, "r": 1, "w": 1, "h": 1 },
          { "c": 5, "r": 1, "w": 1, "h": 1 },
          { "c": 4, "r": 2, "w": 2, "h": 1 },
        ],
        galleryDisplayTransition: 'slideUp', galleryDisplayTransitionDuration: 500,

        // ### viewer/lighbox settings
        slideshowDelay: Alpine.store('ngy').slideshowInterval * 1000,
        viewerTools:    {
          topLeft:   'pageCounter, label',
          topRight:  'fullscreenButton, playPauseButton, closeButton'
        },

        // ### gallery content ### 
        items: nanoGalleryItems,
        locationHash: false
      });
    });
  };

  let defaultAlbum = 'nature';
  loadAlbum(defaultAlbum );

  Alpine.store('ngy', {
    slideshowInterval: 3,
    currentAlbum: defaultAlbum,
    currentAlbumTitle: 'NONE',
    changeAlbum(event) {
      // Determine the clicked element (use the passed event or fallback to the active element)
      const _target = (event && event.target) || document.activeElement;
      const _selectedAlbum = _target && _target.getAttribute ? _target.getAttribute('data-album-selector') : null;
      if (!_selectedAlbum || _selectedAlbum === Alpine.store('ngy').currentAlbum) return;

      jQuery('#nanogallery2').nanogallery2('destroy');
      loadAlbum(_selectedAlbum);
    }
  });

  Alpine.data('NanoGalleryContainer', function() {
    return {
      updateSlideshowInterval() {
        const ngy2Instance = jQuery('#nanogallery2').nanogallery2('instance');
        currentSlideshowDelay = ngy2Instance.VOM.slideshowDelay;
        newSlideshowDelay = Alpine.store('ngy').slideshowInterval * 1000;
        if(currentSlideshowDelay === newSlideshowDelay) return;

        ngy2Instance.O.slideshowDelay = newSlideshowDelay;
        ngy2Instance.VOM.slideshowDelay = newSlideshowDelay;
      }
    }
  });
});
