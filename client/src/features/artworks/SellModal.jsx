import { useState } from 'react';
import Modal from '../../components/ui/Modal';
import Select from '../../components/ui/Select';
import Button from '../../components/ui/Button';
import { useSellArtworkMutation } from './artworkApi';
import { useGetBuyersQuery } from '../buyer/buyerApi';

export default function SellModal({ open, onClose, artwork }) {
  const [buyerCin, setBuyerCin] = useState('');
  const { data: buyers = [] } = useGetBuyersQuery();
  const [sell, { isLoading, error }] = useSellArtworkMutation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!buyerCin) return;
    try {
      await sell({ id: artwork._id, buyerCin }).unwrap();
      onClose();
    } catch {
      // error shown
    }
  };

  if (!artwork) return null;

  return (
    <Modal open={open} onClose={onClose} title="Sell Artwork">
      <form onSubmit={handleSubmit} className="space-y-4">
        <p className="text-sm text-navy-700">
          Artwork: <span className="font-medium">{artwork.title}</span>
        </p>

        <Select
          label="Buyer"
          required
          value={buyerCin}
          onChange={(e) => setBuyerCin(e.target.value)}
        >
          <option value="">Select a buyer</option>
          {buyers.map((b) => (
            <option key={b._id} value={b.cin}>
              {b.firstName} {b.lastName} ({b.cin})
            </option>
          ))}
        </Select>

        {error && (
          <p className="text-sm text-red-600">
            {error?.data?.message || 'Failed to sell artwork'}
          </p>
        )}

        <div className="flex justify-end gap-3 pt-2">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" loading={isLoading}>
            Confirm Sale
          </Button>
        </div>
      </form>
    </Modal>
  );
}