import { useCallback, useState } from "react";
import { useCookies } from "react-cookie";
import Cropper from "react-easy-crop";
import getCroppedImg from "./Crop";

const EasyCrop = ({ image }) => {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [croppedImage, setCroppedImage] = useState(null);
  const [cookies, setCookie] = useCookies(['croppedImage']);

  const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const showCroppedImage = useCallback(async () => {
    try {
      const croppedImage = await getCroppedImg(
        image,
        croppedAreaPixels,
        rotation
      );
      setCroppedImage(croppedImage);
      setCookie('croppedImage', croppedImage);
    } catch (e) {
      console.error(e);
    }
  }, [croppedAreaPixels, rotation, image]);

  const onClose = useCallback(() => {
    setCroppedImage(null);
  }, []);

  return (
    <div>
      <div
        className="containers"
        style={{
          display: image === null || croppedImage !== null ? "none" : "block",
        }}
      >
        <div className="crop-container">
          <Cropper
            image={image}
            crop={crop}
            rotation={rotation}
            zoom={zoom}
            zoomSpeed={4}
            maxZoom={3}
            zoomWithScroll={true}
            showGrid={true}
            aspect={4 / 3}
            onCropChange={setCrop}
            onCropComplete={onCropComplete}
            onZoomChange={setZoom}
            onRotationChange={setRotation}
          />
        </div>
      </div>
      <button
        style={{
          display: image === null || croppedImage !== null ? "none" : "block",
          width: "-webkit-fill-available"
        }}
        className="my-2"
        onClick={showCroppedImage}
      >
        Crop
      </button>
      <div className="cropped-image-container">
        {croppedImage && (
          <img className="reactEasyCrop_Contain cropped-image" style={{ position: "relative" }} src={croppedImage} alt="cropped" />
        )}
        {croppedImage && <button className="my-2" onClick={onClose}>close</button>}
      </div>
    </div>
  );
};

export default EasyCrop;