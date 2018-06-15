# Application API
class Api < Grape::API
  format :json

  # Pass params as JSON string in request body alongside with request params
  before do
    parsed_body = JSON.parse(request.body.first)
    parsed_body.each_pair do |k, v|
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
