# Time slots for booking
#
# == Schema Information
#
# Table name: slots
#
#  booked     :boolean          default(FALSE), not null
#  created_at :datetime         not null
#  end_at     :datetime         not null
#  id         :bigint(8)        not null, primary key
#  start_at   :datetime         not null
#  updated_at :datetime         not null
#
# Indexes
#
#  index_slots_on_end_at    (end_at) UNIQUE
#  index_slots_on_start_at  (start_at) UNIQUE
#
class Slot < ApplicationRecord
  include Grape::Entity::DSL

  validates :start_at, :end_at, presence: true, uniqueness: true
  validate :end_after_start

  entity :start_at, :end_at, :booked

  # Create new time slots from array. Slots being set with `start_at` and `end_at` datetime
  def self.create_many!(slots)
    messages = []
    created = []
    transaction do
      slots.each do |slot|
        res = create(start_at: slot[:start_at], end_at: slot[:end_at])
        if res.errors.messages.present?
          messages << "Slot start_at: #{slot[:start_at]}, end_at: #{slot[:end_at]} create error: " +
                      res.errors.messages.map { |k, v| "#{k} #{v.to_sentence}"}.to_sentence
        else
          created << res
        end
      end

      # rollback all inserts if any one fails
      raise ActiveRecord::Rollback if messages.present?
    end
    return {errors: {messages: messages}} if messages.present?
    created
  end

  # Book a time slot, identified by `start_at` and `end_at` datetime
  def self.book!(start_at, end_at)
    slot = find_by(start_at: start_at, end_at: end_at)
    return {errors: {messages: 'Not found'}} if slot.blank?
    return {errors: {messages: 'Already booked'}} if slot.booked
    slot
  end

  private

  def end_after_start
    errors.add :end_at, 'end_at time must be after start_at time' if end_at <= start_at
  end
end
