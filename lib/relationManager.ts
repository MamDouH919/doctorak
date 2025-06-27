import mongoose from 'mongoose';

/**
 * Syncs a relationship between two models.
 * @param model - The target model (e.g., Account)
 * @param docId - The document to update (e.g., account._id)
 * @param field - The field to update (e.g., 'faqs')
 * @param value - The value to push/pull (e.g., faq._id)
 * @param action - 'add' or 'remove'
 */
export async function syncRelation({
  model,
  docId,
  field,
  value,
  action,
}: {
  model: mongoose.Model<any>;
  docId: mongoose.Types.ObjectId | string;
  field: string;
  value: mongoose.Types.ObjectId | string;
  action: 'add' | 'remove';
}) {
  const update: Record<string, any> = {};
  if (action === 'add') {
    update.$addToSet = { [field]: value };
  } else if (action === 'remove') {
    update.$pull = { [field]: value };
  }

  await model.findByIdAndUpdate(docId, update);
}
