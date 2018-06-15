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

  entity :start_at, :end_at, :booked

  # Create new time slots from array. Slots being set with `start_at` and `end_at` datetime
  def self.create_many!(slots)
    slots.each do |slot|
      create!(slot)
    end
  end

  # Book a time slot, identified by `start_at` and `end_at` datetime
  def self.book!(start_at, end_at)
    slot = find_by(start_at: start_at, end_at: end_at)
    return {error: {message: 'Not found'}} if slot.blank?
    return {error: {message: 'Already booked'}} if slot.booked
    slot
  end
end
