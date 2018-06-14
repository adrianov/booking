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
  # Create new slots from array of them
  def self.create_many!(slots)
    'create_many stub'
  end

  # Book a slot
  def self.book!(start_at, end_at)
    'book stub'
  end
end
