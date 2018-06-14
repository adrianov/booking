class CreateSlots < ActiveRecord::Migration[5.2]
  def change
    create_table :slots do |t|
      t.datetime :start_at, null: false

      # because `end` is reserved keyword in Ruby
      t.datetime :end_at, null: false
      t.boolean :booked, null: false, default: false

      t.index :start_at, unique: true
      t.index :end_at, unique: true
      t.timestamps
    end
  end
end
