import { useState } from 'react';
import Modal from '../../components/ui/Modal';
import Select from '../../components/ui/Select';
import Button from '../../components/ui/Button';
import { STATUS_OPTIONS, STATUS_LABELS } from './artworkUtils';
import { useChangeArtworkStatusMutation } from './artworkApi';
import ArtworkStatus from './ArtworkStatus';

export default function StatusChangeModal({ open, onClose, artwork }) {
  const [status, setStatus] = useState(artwork?.status || '');
  const [changeStatus, { isLoading, error }] =
    useChangeArtworkStatusMutation();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!status || status === artwork.status) return;

    try {
      await changeStatus({
        id: artwork._id,
        status,
      }).unwrap();

      onClose();
    } catch {
      // error shown
    }
  };

  if (!artwork) return null;

  const availableStatuses =
    artwork.status === 'sold'
      ? STATUS_OPTIONS.filter((s) => s === 'returned')
      : STATUS_OPTIONS.filter((s) => s !== 'sold');

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Change Artwork Status"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <p className="text-sm text-navy-600 mb-1">
            Current status
          </p>

          <ArtworkStatus status={artwork.status} />
        </div>

        <Select
          label="New status"
          required
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          {availableStatuses.map((s) => (
            <option key={s} value={s}>
              {STATUS_LABELS[s]}
            </option>
          ))}
        </Select>

        {error && (
          <p className="text-sm text-red-600">
            {error?.data?.message || 'Failed to update status'}
          </p>
        )}

        <div className="flex justify-end gap-3 pt-2">
          <Button
            type="button"
            variant="secondary"
            onClick={onClose}
          >
            Cancel
          </Button>

          <Button type="submit" loading={isLoading}>
            Update Status
          </Button>
        </div>
      </form>
    </Modal>
  );
}