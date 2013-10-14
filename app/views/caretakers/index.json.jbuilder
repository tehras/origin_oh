json.array!(@caretakers) do |caretaker|
  json.extract! caretaker, :first_name, :last_name, :email, :age, :nationality, :comment, :citizen, :car, :driver_license, :english
  json.url caretaker_url(caretaker, format: :json)
end
