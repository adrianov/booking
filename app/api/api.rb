# Application API
class Api < Grape::API
  format :json

  # Pass params as JSON string in request body
  before do
    parsed_body = JSON.parse(request.body.first)
    parsed_body.each_pair do |k, v|
      params[k] = v
    end
  end
  resource :slots do
    params do
      requires :start_at, type: DateTime
      requires :end_at, type: DateTime
    end
    get do
      present Slot.where('start_at >= ?', params[:start_at]).where('end_at <= ?', params[:end_at])
    end

    params do
      requires :slots, type: Array do
        requires :start_at, type: DateTime
        requires :end_at, type: DateTime
      end
    end
    post do
      present Slot.create_many!(params[:slots])
    end

    params do
      requires :start_at, type: DateTime
      requires :end_at, type: DateTime
    end
    patch :book do
      ap params[:start_at]
      present Slot.book!(params[:start_at], params[:end_at])
    end
  end
end
