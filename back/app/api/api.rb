# Application API
class Api < Grape::API
  format :json

  # Pass params as JSON string in `data` param alongside with other params
  before do
    next if params[:data].blank?

    parsed_data = JSON.parse(params[:data])
    parsed_data.each_pair do |k, v|
      params[k] = v
    end
  end

  # Time slots for booking
  resource :slots do
    # Get available slots in time between `start_at` and `end_at` datetime
    params do
      requires :start_at, type: DateTime
      requires :end_at, type: DateTime
    end
    get do
      present Slot.where('start_at >= ?', params[:start_at]).where('end_at <= ?', params[:end_at])
    end

    # Create new time slots from array. Slots being set with `start_at` and `end_at` datetime
    params do
      requires :slots, type: Array do
        requires :start_at, type: DateTime
        requires :end_at, type: DateTime
      end
    end
    post do
      present Slot.create_many!(params[:slots])
    end

    # Book a time slot, identified by `start_at` and `end_at` datetime
    params do
      requires :start_at, type: DateTime
      requires :end_at, type: DateTime
    end
    patch :book do
      present Slot.book!(params[:start_at], params[:end_at])
    end
  end
end
