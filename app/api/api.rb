# Application API
class Api < Grape::API
  format :json

  resource :slots do
    get do
      present Slot.where('start_at >= ?', params[:start_at]).where('end_at <= ?', params[:end_at])
    end

    post do
      present Slot.create_many!(params[:slots])
    end

    patch :book do
      present Slot.book!(params[:start_at], params[:end_at])
    end
  end
end
