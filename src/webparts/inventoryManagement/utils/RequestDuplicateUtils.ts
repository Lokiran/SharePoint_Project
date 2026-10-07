// One open request per person and asset type: a type can be requested again only after the
// earlier request is finished (asset assigned by the admin) or rejected by the manager.
// Pure (no SharePoint / localization imports) so it is unit-testable.
import { IRequest } from '../models/IRequest';
import { getSlaStage } from './RequestSlaUtils';

const normalizeName = (value?: string): string => (value || '').toLowerCase().replace(/[^a-z0-9]/g, '');

/**
 * True when a request's requester is the given person. Same rule the app uses for
 * "my requests": names are compared without spaces or punctuation, and one containing the other counts.
 */
export const isSameRequester = (requesterName?: string, personName?: string): boolean => {
  const owner = normalizeName(requesterName);
  const person = normalizeName(personName);
  if (!owner || !person) return false;
  return owner === person || owner.indexOf(person) >= 0 || person.indexOf(owner) >= 0;
};

export const isSameAssetType = (a?: string, b?: string): boolean => {
  const left = (a || '').trim().toLowerCase();
  return !!left && left === (b || '').trim().toLowerCase();
};

/** Still in the flow: waiting for the manager's decision, or approved and waiting for the admin to assign. */
export const isOpenRequest = (request: IRequest): boolean => {
  const stage = getSlaStage(request);
  return stage === 'awaitingApproval' || stage === 'awaitingAssignment';
};

/** The person's open request for this asset type, if any (the one that blocks a new request). */
export const findOpenRequest = (requests: IRequest[], requesterName: string | undefined, assetType: string | undefined): IRequest | undefined =>
  (requests || []).filter(r =>
    isOpenRequest(r) && isSameAssetType(r.assetTitle, assetType) && isSameRequester(r.requesterName, requesterName))[0];
