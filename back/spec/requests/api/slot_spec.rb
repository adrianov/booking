require 'spec_helper'

describe Api do
  describe 'GET /slots' do
    it 'returns empty array if no slots' do
      get '/slots', params: { data: { start_at: DateTime.now, end_at: DateTime.now + 1.hour }.to_json }
      expect(JSON.parse(response.body)).to eq([])
    end
  end

  describe 'POST /slots' do
    it 'creates array of time slots' do
      slot1 = attributes_for(:slot)
      slot2 = attributes_for(:slot2)
      slots = {
        slots: [
          slot1.without(:booked),
          slot2.without(:booked)
        ]
      }

      post '/slots', params: { data: slots.to_json }
      expect(response.body).to eq [slot1, slot2].to_json

      get '/slots', params: { data: { start_at: slot1[:start_at], end_at: slot2[:end_at] }.to_json }
      expect(response.body).to eq [slot1, slot2].to_json
    end
  end

  describe 'PATCH /slots/book' do
    it 'books existing slot' do
      slot = attributes_for(:slot)
      post '/slots', params: { data: { slots: [slot] }.to_json }
      patch '/slots/book', params: { data: slot.to_json }
      expect(response.body).to eq slot.merge(booked: true).to_json

      patch '/slots/book', params: { data: slot.to_json }
      expect(response.body).to eq({ error: { messages: ['Already booked'] } }.to_json)
    end
  end
end
