import { useNavigate } from 'react-router-dom';
import { useCreateArtworkMutation } from '../../features/artworks/artworkApi';
import ArtworkForm from '../../features/artworks/ArtworkForm';
import Card from '../../components/ui/Card';

export default function NewArtwork() {
  const navigate = useNavigate();
  const [createArtwork, { isLoading }] = useCreateArtworkMutation();

  const handleSubmit = async (payload) => {
    try {
      const res = await createArtwork(payload).unwrap();
      navigate(`/artworks/${res._id || res.id}`);
    } catch {
      // error handled in form if needed
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <Card title="Create New Artwork">
        <ArtworkForm
          onSubmit={handleSubmit}
          isLoading={isLoading}
          submitLabel="Create Artwork"
        />
      </Card>
    </div>
  );
}