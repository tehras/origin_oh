json.array!(@clients) do |client|
  json.extract! client, :first_name, :last_name, :email, :home_number, :mobile_phone, :fax_number, :street, :state, :zip, :nationality, :languages, :english, :years, :hha, :driver_license, :car, :notes
  json.url client_url(client, format: :json)
end
