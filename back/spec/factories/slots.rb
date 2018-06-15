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

FactoryBot.define do
  factory :slot do
    start_at "2018-06-14 20:00:00"
    end_at "2018-06-14 21:00:00"
    booked false
  end
end
