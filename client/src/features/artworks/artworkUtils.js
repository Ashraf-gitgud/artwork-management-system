export const STATUS_LABELS = {
  for_sale: 'For Sale',
  for_auction: 'For Auction',
  for_exhibit: 'For Exhibit',
  in_storage: 'In Storage',
  being_restored: 'Being Restored',
  sold: 'Sold',
  returned: 'Returned',
  missing: 'Missing',
};

export const STATUS_OPTIONS = Object.keys(STATUS_LABELS);

export const BIN_STATUSES = ['sold', 'missing'];

export const ACTIVE_STATUSES = STATUS_OPTIONS.filter(
  (s) => !BIN_STATUSES.includes(s)
);

export const CONDITION_OPTIONS = ['Pristine', 'Good', 'Damaged', 'Deteriorated'];

export const UNIT_OPTIONS = ['cm', 'in', 'mm'];

export function isBinStatus(status) {
  return BIN_STATUSES.includes(status);
}